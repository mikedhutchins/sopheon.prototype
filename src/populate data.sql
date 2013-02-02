/*
delete from gates;

delete from Projects;
*/
declare @x int = 1, @xidx int = 0, @xd int = 1;
declare @c int = 200, @cidx int = 0, @tid int = 1;
declare @gc int = 5, @gcidx int = 0, @gtid int = 1, @pid int ;

while @xidx < @x begin
	select @cidx = 0
while @cidx < @c begin
	insert into Projects (Name, TemplateId)
	values ('Project ' + cast (@cidx as nvarchar(10)), @tid )
	
	select @pid = @@IDENTITY;
	
	if (@tid >= 4) begin
		select @tid = 1;
	end
	else select @tid = @tid + 1;	

	set @gcidx = 0;

	while @gcidx < @gc begin
	
	insert into Gates (Name, ProjectId, ScheduledCompletion )
	values ('Gate ' + cast (@gcidx as nvarchar(10))
		+ ' Project# ' + CAST(@cidx as nvarchar(10))
		, @pid, '10/01/' + CAST((2000 + @GCIDX) AS NVARCHAR(10)) )
	
	select @gcidx = @gcidx + 1

	if (@gtid >= 4) begin
		select @gtid = 1;
	end
	else select @gtid = @gtid + 1;
	end
	select @cidx = @cidx + 1

end

	select @xidx = @xidx + 1
end 